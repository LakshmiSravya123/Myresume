import { useState } from "react";
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
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" }
  ];

  const handleNavClick = (id: string) => {
    onSectionClick(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <Logo className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Lakshmi Sravya</h1>
              <p className="text-xs text-gray-600">Data Scientist</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                data-testid={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onChatToggle}
              className="text-gray-600 hover:text-blue-600"
              title="Ask AI about my resume"
              data-testid="button-chat-toggle"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://github.com/LakshmiSravya123/', '_blank')}
              className="text-gray-600 hover:text-blue-600"
              data-testid="button-github"
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://www.linkedin.com/in/lakshmi-sravya-vedantham-592ba977/', '_blank')}
              className="text-gray-600 hover:text-blue-600"
              data-testid="button-linkedin"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => window.location.href = 'mailto:lakshmisravya.vedantham@gmail.com'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              data-testid="button-contact"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                  data-testid={`mobile-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChatToggle();
                    setIsOpen(false);
                  }}
                  data-testid="mobile-button-chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://github.com/LakshmiSravya123/', '_blank')}
                  data-testid="mobile-button-github"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://www.linkedin.com/in/lakshmi-sravya-vedantham-592ba977/', '_blank')}
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