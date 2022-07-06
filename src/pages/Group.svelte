<script lang="ts">
  export let params: { id: string };

  import { replace } from "svelte-spa-router";
  import { doc, onSnapshot } from "firebase/firestore";
  import { onMount } from "svelte";
  import { firestore } from "@/lib/firebase";
  import { GroupSchema, group, Group } from "@/stores/group";

  let groupVal: Group;
  group.subscribe((val) => (groupVal = val));

  const setGroup = (_group: Group) => group.set(_group);

  onMount(() => {
    const unsub = onSnapshot(
      doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
      (snapshot) => {
        // push to 404 if group not found
        if (!snapshot.exists()) {
          replace("/404");
          return;
        }
        const group = GroupSchema.parse(snapshot.data());
        setGroup(group);
      }
    );
    return () => {
      unsub();
    };
  });
</script>

<main class="h-screen flex flex-col justify-center items-center prose">
  <h1>Group {params.id}</h1>
  <pre>{JSON.stringify(groupVal, null, 2)}</pre>
</main>
