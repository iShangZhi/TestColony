/**
 * Runs BEFORE React hydration. Sets dark class based on localStorage.
 * Server always renders <html class="dark">, this script removes it if needed.
 */
const THEME_SCRIPT = `!function(){try{var t=localStorage.getItem('testcolony-theme');if(t==='light')document.documentElement.classList.remove('dark')}catch(e){}}()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
