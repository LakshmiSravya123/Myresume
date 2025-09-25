import logoImage from "@assets/6F3E376A-FD9E-4A42-BAC0-69D9A66F2453_1_201_a_1758236938466.jpeg";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <img 
        src={logoImage} 
        alt="Lakshmi Sravya Vedantham - Data Scientist" 
        className="w-full h-full object-cover rounded-full border-2 border-blue-200 shadow-sm"
      />
    </div>
  );
}