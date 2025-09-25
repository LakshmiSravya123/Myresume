import logoImage from "@assets/image_1758836311675.png";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <img 
        src={logoImage} 
        alt="Lakshmi Sravya Vedantham - Data Scientist Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}