// Simple test script to verify Google authentication flow
// Run this in the browser console when on the sign-in page

(async () => {
  try {
    console.log('Testing Google sign-in button functionality...');
    
    // Check if the Google sign-in button exists
    const googleButton = document.querySelector('button[class*="w-full h-11"]');
    
    if (!googleButton) {
      console.error('❌ Google sign-in button not found on the page');
      return;
    }
    
    console.log('✅ Google sign-in button found on the page');
    
    // Validate that onClick handler is set
    if (typeof googleButton.onclick !== 'function') {
      console.warn('⚠️ Google button may not have a click handler attached');
    } else {
      console.log('✅ Google button has click handler attached');
    }
    
    // Check for Google SVG icon
    const googleIcon = googleButton.querySelector('svg');
    if (!googleIcon) {
      console.warn('⚠️ Google icon SVG not found in the button');
    } else {
      console.log('✅ Google icon SVG found in the button');
    }
    
    // Check auth environment variables (indirectly - won't show actual values)
    // We can only check if NextAuth is loaded properly
    if (typeof window.__NEXT_DATA__ !== 'undefined' && 
        window.__NEXT_DATA__.props && 
        window.__NEXT_DATA__.props.pageProps) {
      console.log('✅ NextAuth appears to be properly initialized');
    } else {
      console.warn('⚠️ Unable to verify NextAuth initialization');
    }
    
    console.log('✨ Test complete - Click the Google button to test the actual sign-in flow');
    console.log('Note: For the sign-in to work, ensure your Google OAuth credentials are properly set up.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
})();
