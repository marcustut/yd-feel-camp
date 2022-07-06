<script lang="ts">
  import { twMerge } from "tailwind-merge";
  let className = "";
  export { className as class };
</script>

<main
  class={twMerge(
    "h-screen flex flex-col justify-center items-center",
    className
  )}
>
  <div class="artboard phone-1 prose">
    <slot />
  </div>
</main>
