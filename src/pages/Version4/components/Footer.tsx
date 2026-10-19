export default function Footer() {
  const linkClass =
    "text-white no-underline hover:opacity-80 transition-opacity text-14px leading-relaxed";
  const columnTitleClass = "text-white font-bold text-14px mb-16px block";

  return (
    <footer className="bg-black text-white w-full min-h-337px box-border">
      <div className="max-w-1200px mx-auto px-24px py-48px flex  md:flex-row md:items-start  gap-40px md:gap-84px">
        {/* 左侧品牌 */}
        <div className="flex-shrink-0 ">
          <span className="text-20px md:text-24px font-bold tracking-tight">
            Blitzo
          </span>
        </div>

        {/* 右侧导航列 */}
        <nav className="flex justify-end flex-wrap gap-40px md:gap-64px flex-1 ">
          {/* Company */}
          <div className="flex flex-col">
            <span className={columnTitleClass}>Company</span>
            <div className="flex flex-col gap-12px">
              <a href="#" className={linkClass}>
                Terms of Service
              </a>
              <a href="#" className={linkClass}>
                Privacy Policy
              </a>
              <a href="#" className={linkClass}>
                Careers
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col">
            <span className={columnTitleClass}>Socials</span>
            <div className="flex flex-col gap-12px">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                X (Twitter)
              </a>
            </div>
          </div>

          {/* Help */}
          <div className="flex flex-col">
            <span className={columnTitleClass}>Help</span>
            <div className="flex flex-col gap-12px">
              <a href="mailto:support@example.com" className={linkClass}>
                Support Email
              </a>
            </div>
          </div>
        </nav>
      </div>
    </footer>
  );
}
