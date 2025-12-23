/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `
      $yellow: hsl(43, 96%, 56%);
      $text: hsl(120, 2%, 10%);
      $secondary-text: hsla(120, 2%, 35%, 1.00);
      $white: hsl(47, 64%, 96%);
      $grey: hsl(150, 4%, 89%);
      @mixin flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      @mixin flex-column {
        display: flex;
        flex-direction: column;
      }
      @mixin flex-start {
        display: flex;
        align-items: flex-start;
      }
      @mixin flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  }
}

export default nextConfig;
