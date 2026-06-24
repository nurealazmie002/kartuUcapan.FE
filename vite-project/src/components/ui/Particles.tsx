
export const renderParticles = (theme: string) => {
  if (theme === 'Ceria') {
    const colors = ['bg-pink-400', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-teal-400'];
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 25 }).map((_, i) => {
          const color = colors[i % colors.length];
          const size = Math.random() * 10 + 6;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = Math.random() * 3 + 4;
          return (
            <div
              key={i}
              className={`absolute rounded-full animate-confetti-particle ${color}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                top: '-10px'
              }}
            />
          );
        })}
      </div>
    );
  }

  if (theme === 'Elegan') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const size = Math.random() * 4 + 2;
          const delay = Math.random() * 4;
          return (
            <span
              key={i}
              className="material-symbols-outlined absolute text-[#ffd700]/70 animate-sparkle-glow fill-icon"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                fontSize: `${size * 4}px`,
                animationDelay: `${delay}s`
              }}
            >
              star
            </span>
          );
        })}
      </div>
    );
  }

  if (theme === 'Klasik') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#8b5a2b]/30 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#8b5a2b]/30 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#8b5a2b]/30 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#8b5a2b]/30 rounded-br-lg"></div>
        {Array.from({ length: 15 }).map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 6;
          return (
            <div
              key={i}
              className="absolute bg-[#8b5a2b]/20 rounded-full animate-pulse"
              style={{
                width: '4px',
                height: '4px',
                left: `${left}%`,
                top: `${top}%`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>
    );
  }

  if (theme === 'Playful') {
    const symbols = ['celebration', 'favorite', 'school', 'star', 'music_note'];
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 8 }).map((_, i) => {
          const sym = symbols[i % symbols.length];
          const left = Math.random() * 90 + 5;
          const top = Math.random() * 90 + 5;
          const color = i % 2 === 0 ? 'text-[#ff4d8d]/30' : 'text-[#fdc003]/30';
          const size = Math.random() * 16 + 24;
          const delay = Math.random() * 3;
          return (
            <span
              key={i}
              className={`material-symbols-outlined absolute ${color} animate-float-doodle`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                fontSize: `${size}px`,
                animationDelay: `${delay}s`
              }}
            >
              {sym}
            </span>
          );
        })}
      </div>
    );
  }

  if (theme === 'Serenity') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-44 h-44 bg-[#e0f2f1]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-52 h-52 bg-[#e1f5fe]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 right-10 w-36 h-36 bg-[#f3e5f5]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '6s' }}></div>
      </div>
    );
  }

  return null;
};
