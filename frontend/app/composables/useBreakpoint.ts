import { BREAKPOINT_MOBILE, BREAKPOINT_TABLET, BREAKPOINT_DESKTOP, BREAKPOINT_LARGE_DESKTOP } from './constants';
import { debounce } from './utils';

/**
 * Reactive composable for screen size and breakpoints
 * Automatically updates when window is resized
 * 
 * @example
 * ```ts
 * const { width, height, isMobile, isTablet, isDesktop } = useBreakpoint();
 * 
 * // Use in template
 * <div v-if="isMobile">Mobile content</div>
 * 
 * // Use in script
 * watch(isMobile, (mobile) => {
 *   if (mobile) console.log('Switched to mobile');
 * });
 * ```
 */
export function useBreakpoint() {
  // Default values for SSR
  const width = ref(0);
  const height = ref(0);

  // Computed breakpoint checks
  const isMobile = computed(() => width.value <= BREAKPOINT_MOBILE);
  const isTablet = computed(() => width.value <= BREAKPOINT_TABLET);
  const isDesktop = computed(() => width.value >= BREAKPOINT_DESKTOP);
  const isLargeDesktop = computed(() => width.value >= BREAKPOINT_LARGE_DESKTOP);

  // Update dimensions function
  const updateDimensions = () => {
    if (import.meta.client) {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    }
  };

  // Debounced version for resize events (optimize performance)
  const debouncedUpdate = debounce(updateDimensions, 150);

  // Initialize on mount
  onMounted(() => {
    if (import.meta.client) {
      updateDimensions();
      window.addEventListener('resize', debouncedUpdate);
    }
  });

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', debouncedUpdate);
    }
  });

  return {
    width: readonly(width),
    height: readonly(height),
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}

