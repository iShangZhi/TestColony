/**
 * Inline script that runs BEFORE React hydration.
 * Reads theme preference from localStorage and applies the correct class,
 * preventing any flash of wrong theme.
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('testcolony-theme');
              if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                // Default to dark mode
                document.documentElement.classList.add('dark');
                if (!theme) localStorage.setItem('testcolony-theme', 'dark');
              }
            } catch(e) {
              // Fallback to dark
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  );
}
