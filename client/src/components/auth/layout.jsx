import { Outlet } from "react-router-dom";
import nt11Image from "@/assets/nt11.jpg";

function AuthLayout() {
  const titleText = "Welcome to GreenBasket";

  return (
    <div className="flex min-h-screen w-full">
      <div
        className="relative hidden lg:flex w-1/2 items-center justify-center overflow-hidden px-12"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${nt11Image})`,
            animation: "authHeroMotion 18s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-md space-y-6 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            {titleText.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="auth-title-letter inline-block"
                style={{
                  animation:
                    "authLetterDance 650ms cubic-bezier(0.2, 0.7, 0.2, 1) 1 both, authLetterIdle 2.8s ease-in-out infinite",
                  animationDelay: `${index * 65}ms, ${index * 65 + 900}ms`,
                  willChange: "transform, opacity, text-shadow",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="text-base font-medium text-white/90 drop-shadow-sm">
            Fresh groceries delivered fast
          </p>
        </div>
        <style>
          {`
            @keyframes authHeroMotion {
              0% {
                transform: scale(1) translate3d(0, 0, 0);
              }
              100% {
                transform: scale(1.08) translate3d(-1.5%, 1.5%, 0);
              }
            }

            @keyframes authLetterDance {
              0% {
                transform: translateY(12px) scale(0.95);
                opacity: 0;
                text-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
              }
              55% {
                transform: translateY(-10px) scale(1.04);
                opacity: 1;
                text-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
              }
              100% {
                transform: translateY(0) scale(1);
                opacity: 1;
                text-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
              }
            }

            @keyframes authLetterIdle {
              0%,
              100% {
                transform: translateY(0);
                text-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
              }
              50% {
                transform: translateY(-4px);
                text-shadow: 0 9px 20px rgba(0, 0, 0, 0.34);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .auth-title-letter {
                animation: none !important;
              }
            }
          `}
        </style>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;