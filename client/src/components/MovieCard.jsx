import { useEffect, useRef, useState } from "react";

function MovieCard({ movie, onClick }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`card cursor-pointer group transition-all duration-500 hover:-translate-y-1.5 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.png"
        }
        alt={movie.title}
        loading="lazy"
        className="w-full aspect-2/3 rounded-sm border border-white/10 block object-cover group-hover:border-[#00e054] transition-colors duration-200"
      />
      <h3 className="text-[#99aabb] text-[0.75rem] text-center mt-2 font-normal truncate group-hover:text-white transition-colors duration-200">
        {movie.title}
      </h3>
    </div>
  );
}

export default MovieCard;
