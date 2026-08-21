import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logoBranco from "@/assets/logo-branco.png";
import { fetchProjects } from "@/lib/projectsApi";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Close on click outside
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest?.('[data-search-container]')) return;
      setSearchOpen(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 300);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [searchOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "Sobre" },
    { href: "/projetos", label: "Projetos" },
    { href: "/contato", label: "Contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-sm"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-7 md:px-9 py-5">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
              <Link to="/" className="flex items-center w-fit">
                <motion.img
                  src={logoBranco}
                  alt="Kronica"
                  className="h-5 md:h-6"
                />
              </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!searchOpen && (
                <motion.div
                  className="flex items-center gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="relative text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 group py-1 overflow-hidden"
                    >
                      <span className="flex flex-col h-[1.2em] overflow-hidden">
                        <motion.span
                          className={`block transition-transform duration-300 group-hover:-translate-y-full ${isActive(link.href) ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {link.label}
                        </motion.span>
                        <motion.span
                          className="block transition-transform duration-300 group-hover:-translate-y-full text-foreground"
                          aria-hidden
                        >
                          {link.label}
                        </motion.span>
                      </span>
                      <motion.span
                        className="absolute bottom-0 left-0 h-[1px] bg-foreground"
                        initial={false}
                        animate={{ width: isActive(link.href) ? "100%" : "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search - Right */}
          <div className="hidden md:flex flex-1 items-center justify-end" ref={searchContainerRef} data-search-container>
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  className="relative flex items-center"
                  initial={{ width: 40, opacity: 0.5 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="relative w-full flex items-center border border-border/40 rounded-full bg-background/60 backdrop-blur-sm px-4 py-1.5">
                    <Search size={16} className="text-muted-foreground shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar projeto..."
                      className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground ml-2 w-full"
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Results dropdown */}
                  {searchQuery.length > 0 && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-full bg-background/95 backdrop-blur-xl border border-border/30 rounded-lg overflow-hidden shadow-lg"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filteredProjects.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-4 py-3">Nenhum projeto encontrado.</p>
                      ) : (
                        filteredProjects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              navigate(`/projetos/${project.id}`);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                          >
                            <img
                              src={project.images.cover}
                              alt={project.title}
                              className="w-9 h-9 rounded object-cover shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">{project.title}</p>
                              <p className="text-xs text-muted-foreground">{project.category}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="search-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchOpen(true)}
                      aria-label="Buscar projetos"
                    >
                      <Search size={20} />
                    </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar projetos"
            >
              <Search size={18} />
            </Button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="md:hidden pt-2 pb-1 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              ref={searchContainerRef}
              data-search-container
            >
              <div className="relative">
                <div className="flex items-center border border-border/40 rounded-full bg-background/60 px-4 py-2">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar projeto..."
                    className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground ml-2 w-full"
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground shrink-0">
                    <X size={14} />
                  </button>
                </div>
                {searchQuery.length > 0 && (
                  <div className="mt-2 bg-background/95 border border-border/30 rounded-lg overflow-hidden">
                    {filteredProjects.length === 0 ? (
                      <p className="text-xs text-muted-foreground px-4 py-3">Nenhum projeto encontrado.</p>
                    ) : (
                      filteredProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            navigate(`/projetos/${project.id}`);
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                        >
                          <img src={project.images.cover} alt={project.title} className="w-9 h-9 rounded object-cover shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{project.category}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden pt-4 pb-2 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-sm font-medium py-3 block transition-colors hover:text-foreground hover:pl-2 ${
                        isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
