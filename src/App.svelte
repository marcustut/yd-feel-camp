<script lang="ts">
  import Router from "svelte-spa-router";
  import Group from "@/pages/Group.svelte";
  import NotFound from "@/pages/NotFound.svelte";

  const routes = {
    "/group/:id": Group,
    "*": NotFound,
  };
</script>

<body>
  <Router {routes} />
</body>
