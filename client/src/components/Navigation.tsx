import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

interface NavigationProps {
  onSectionClick: (section: string) => void;
  onChatToggle: () => void;
}

export default function Navigation({ onSectionClick, onChatToggle }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "About", id: "about", isScroll: true },
    { label: "Analytics", id: "analytics", isScroll: true },
    { label: "Stock Dashboard", id: "/stocks", isScroll: false },
    { label: "Projects", id: "projects", isScroll: true },
    { label: "Contact", id: "contact", isScroll: true }
  ];

  const handleNavClick = (id: string) => {
    onSectionClick(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-pink-50 via-yellow-50 to-purple-50 backdrop-blur-md border-b-2 border-pink-200 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <Logo className="h-10 w-10 animate-bounce-gentle" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Lakshmi Sravya ✨</h1>
              <p className="text-xs text-pink-600 font-medium">Data Scientist</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isScroll ? (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-gray-700 hover:text-pink-600 transition-all duration-200 font-semibold hover:scale-105"
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              ) : (
                <Link key={item.id} href={item.id}>
                  <span 
                    className="text-gray-700 hover:text-pink-600 transition-all duration-200 font-semibold cursor-pointer hover:scale-105 inline-block"
                    data-testid={`nav-${item.id.replace('/', '')}`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onChatToggle}
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
              title="Ask AI about my resume"
              data-testid="button-chat-toggle"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://github.com/LakshmiSravya123/', '_blank')}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
              data-testid="button-github"
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://www.linkedin.com/in/lakshmisravyavedantham', '_blank')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              data-testid="button-linkedin"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => window.location.href = 'mailto:lakshmisravya.vedantham@gmail.com'}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              data-testid="button-contact"
            >
              <Mail className="h-4 w-4 mr-2" />
              Let's Chat! 💬
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-100 transition-colors duration-200 rounded-lg font-semibold"
                  data-testid={`mobile-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-pink-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChatToggle();
                    setIsOpen(false);
                  }}
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
                  data-testid="mobile-button-chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://github.com/LakshmiSravya123/', '_blank')}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  data-testid="mobile-button-github"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://www.linkedin.com/in/lakshmisravyavedantham', '_blank')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  data-testid="mobile-button-linkedin"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}