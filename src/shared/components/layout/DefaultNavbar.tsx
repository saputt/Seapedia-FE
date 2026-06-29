import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { VTLink as Link } from "../../utils/VTLink";
import { getParentRoute } from "../../utils/backNavigation";
import useAuthStore from "../../../features/auth/store/authStore";
import useCartStore from "../../../features/cart/store/cartStore";
import ProfileDropdown from "../ui/ProfileDropdown";
import CartPreview from "../ui/CartPreview";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY = 10;

function getSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSearchHistory(query: string) {
  const history = getSearchHistory().filter((h) => h !== query);
  history.unshift(query);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function removeSearchHistoryItem(query: string) {
  const history = getSearchHistory().filter((h) => h !== query);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

const DefaultNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const refreshCart = useCartStore((s) => s.refreshCart);
  const searchQuery = searchParams.get("q") || "";
  const categoryQuery = searchParams.get("category") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopHistory, setShowDesktopHistory] = useState(false);
  const [history, setHistory] = useState<string[]>(getSearchHistory);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!token;

  const filteredHistory = searchInput
    ? history.filter((h) => h.toLowerCase().includes(searchInput.toLowerCase()))
    : history;

  useEffect(() => {
    if (isLoggedIn) refreshCart();
  }, [isLoggedIn, refreshCart]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLockBodyScroll(showMobileSearch);

  const doSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      saveSearchHistory(query.trim());
      setHistory(getSearchHistory());
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        navigate(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        setSearchParams({ q: query.trim() }, { replace: true });
      }
      setShowMobileSearch(false);
      setShowDesktopHistory(false);
    },
    [navigate, setSearchParams]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      doSearch(searchInput);
    }
    if (e.key === "Escape") {
      setShowDesktopHistory(false);
    }
  };

  const handleDeleteHistory = (query: string) => {
    removeSearchHistoryItem(query);
    setHistory(getSearchHistory());
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            {(location.pathname !== "/" || searchQuery || categoryQuery) && (
              <button
                onClick={() => {
                  if (location.pathname === "/") {
                    navigate("/");
                  } else {
                    navigate(getParentRoute(location.pathname));
                  }
                }}
                className="md:hidden p-2 -ml-2 hover:bg-brand-subtle rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight hidden sm:block">
              SEAPEDIA
            </Link>
          </div>

          <div className="hidden md:block flex-1 sm:max-w-md sm:mx-auto relative" ref={desktopSearchRef}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowDesktopHistory(true)}
              onKeyDown={handleSearchKeyDown}
              className="input-neo w-full !py-1.5 !text-sm"
              placeholder="Cari produk..."
            />
            {showDesktopHistory && filteredHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-deep/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Riwayat Pencarian</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem(SEARCH_HISTORY_KEY);
                      setHistory([]);
                    }}
                    className="text-xs text-danger hover:underline"
                  >
                    Hapus Semua
                  </button>
                </div>
                {filteredHistory.map((query) => (
                  <div
                    key={query}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-bg-secondary transition-colors cursor-pointer"
                    onClick={() => {
                      setSearchInput(query);
                      doSearch(query);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="flex-1 text-sm text-text-primary truncate">{query}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(query);
                      }}
                      className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSearchInput(searchQuery);
              setHistory(getSearchHistory());
              setShowMobileSearch(true);
            }}
            className="md:hidden flex-1 flex items-center gap-2 input-neo !py-1.5 !text-sm text-text-muted cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>{searchQuery || "Cari produk..."}</span>
          </button>

          <div className="flex items-center gap-3">
            {isLoggedIn && <CartPreview />}

            {isLoggedIn ? (
              <span className="hidden md:block"><ProfileDropdown /></span>
            ) : (
              <>
                <Link to="/auth/login" className="btn-primary text-sm !py-2 !px-5">
                  Masuk
                </Link>
                <Link to="/auth/register" className="btn-ghost text-sm !py-2 !px-5 hidden sm:inline-flex">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col">
          <div className="flex items-center gap-3 px-4 h-16 border-b-[3px] border-brand-deep shrink-0">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 -ml-2 hover:bg-brand-subtle rounded-lg transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <input
              autoFocus
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="input-neo flex-1 !py-2 !text-sm"
              placeholder="Cari produk..."
            />
          </div>

          {filteredHistory.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Riwayat Pencarian</span>
                <button
                  onClick={() => {
                    localStorage.removeItem(SEARCH_HISTORY_KEY);
                    setHistory([]);
                  }}
                  className="text-xs text-danger hover:underline"
                >
                  Hapus Semua
                </button>
              </div>
              {filteredHistory.map((query) => (
                <div
                  key={query}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <button
                    onClick={() => {
                      setSearchInput(query);
                      doSearch(query);
                    }}
                    className="flex-1 text-left text-sm text-text-primary truncate"
                  >
                    {query}
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(query)}
                    className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {searchInput && filteredHistory.length === 0 && history.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-3">
                <span className="text-xs text-text-muted">Tidak ada riwayat yang cocok</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DefaultNavbar;
