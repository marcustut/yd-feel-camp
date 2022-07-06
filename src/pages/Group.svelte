<script lang="ts">
  export let params: { id: string };

  import { replace } from "svelte-spa-router";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { firestore } from "@/lib/firebase";
  import { GroupSchema, group } from "@/stores/group";
  import Container from "@/components/Container.svelte";
  import { User, user } from "@/stores/user";

  let modalOpen = false;
  let gameStart: boolean | undefined = undefined;

  const handleContinue = async () => {
    if ($group.joined.find((p) => p === $user.name) !== undefined) {
      alert("Name already taken!");
      return;
    }
    handleJoinRoom();
  };

  const handleJoinRoom = async () => {
    if (gameStart === undefined || gameStart === true) return;
    if ($user.name === "") {
      alert("Name cannot be empty!");
      return;
    }

    await updateDoc(
      doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
      { joined: arrayUnion($user.name) }
    );
    modalOpen = false;
  };

  const handleLeaveRoom = () => {
    updateDoc(
      doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
      { joined: arrayRemove($user.name) }
    );
  };

  const handleGameStart = async () => {
    // calculate the number of good and bad
    let badCount = Math.ceil($group.maxPlayers * 0.4);
    let goodCount = Math.ceil($group.maxPlayers * 0.6);

    // make sure numbers are correct
    while (badCount + goodCount > $group.maxPlayers) {
      if (badCount >= goodCount) badCount--;
      else goodCount--;
    }

    // assign bad players
    for (let i = 0; i < badCount; i++)
      await updateDoc(
        doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
        {
          bad: arrayUnion($group.joined[i]),
          joined: arrayRemove($group.joined[i]),
        }
      );
    // assign good players
    for (let i = 0; i < goodCount; i++)
      await updateDoc(
        doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
        {
          good: arrayUnion($group.joined[goodCount - i - 1]),
          joined: arrayRemove($group.joined[goodCount - i - 1]),
        }
      );

    gameStart = true;
  };

  const handleReset = () => {
    updateDoc(
      doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
      {
        bad: [],
        good: [],
        joined: [],
      }
    );
    user.set({ name: "" });
    modalOpen = true;
  };

  const findMyRole = (role: User["role"]) => {
    console.log(role);
    return role == "bad" ? "imposter" : "crewmate";
  };

  onMount(() => {
    // listen to realtime updates from group
    const unsub = onSnapshot(
      doc(firestore, "cyc-young-dreamer", "feel-camp", "groups", params.id),
      async (snapshot) => {
        // push to 404 if group not found
        if (!snapshot.exists()) {
          replace("/404");
          return;
        }
        group.set(GroupSchema.parse(snapshot.data()));
        // check if gameStarted
        gameStart = !($group.bad.length === 0 && $group.good.length === 0);
        // start the game if all players are in the room and the game is not started
        if ($group.maxPlayers - $group.joined.length <= 0 && !gameStart)
          await handleGameStart();
        // sync with local data
        if ($user.name) handleJoinRoom();
        // assign role to user
        if ($group.bad.find((p) => p === $user.name) !== undefined)
          $user.role = "bad";
        else if ($group.good.find((p) => p === $user.name) !== undefined)
          $user.role = "good";
      }
    );

    // force user to join room on first visit
    if ($user.name === "") modalOpen = true;

    // make sure the player leaves the room before leaving the page
    window.onbeforeunload = () => {
      handleLeaveRoom();
    };

    return () => {
      handleLeaveRoom();
      unsub();
    };
  });
</script>

<Container>
  <!-- <pre>{JSON.stringify($group, null, 2)}</pre> -->
  {#if gameStart}
    <div class="h-full not-prose flex flex-col justify-center items-center">
      <h3 class="text-center font-bold text-3xl">Room {params.id}</h3>

      <div class="kbd my-8">
        <strong class="mr-2">{$user.name}</strong> is {$user.role === "bad"
          ? "an"
          : "a"}
        <h1
          class={[
            "ml-2 uppercase inline text-2xl font-bold",
            $user.role === "bad" ? "text-red-500" : "text-blue-500",
          ].join(" ")}
        >
          {findMyRole($user.role)}
        </h1>
      </div>

      <p class="text-center text-sm text-neutral">
        There are {$group.bad.length + $group.good.length} players now in this room.
      </p>

      <button class="mt-4 w-3/5 btn btn-accent" on:click={handleReset}
        >Reset</button
      >
    </div>
  {:else}
    <h1>Group {params.id}</h1>

    <p>
      After all {$group.maxPlayers} players have joined, the roles will be distributed
      to everyone.
    </p>
    <h3>Players in queue:</h3>
    {#each $group.joined as joined, index (index)}
      <li animate:flip={{ delay: 250, duration: 250, easing: quintOut }}>
        {joined}
      </li>
    {/each}
    <div class="text-center">
      <progress class="progress" />
      <span class="text-sm text-primary-content/50"
        >Waiting for {$group.maxPlayers - $group.joined.length} more players...</span
      >
    </div>
  {/if}

  <!-- Modal -->
  <input
    type="checkbox"
    id="name-modal"
    class="modal-toggle"
    bind:checked={modalOpen}
  />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Welcome, {$user.name}!</h3>
      <p>In order to continue, you must first enter your name.</p>
      <input
        id="name-input"
        type="text"
        placeholder="Type your name here!"
        class="input input-bordered w-full"
        bind:value={$user.name}
      />
      <div class="modal-action">
        <button class="w-full btn" on:click={handleContinue}
          >Continue to the game</button
        >
      </div>
    </div>
  </div>
</Container>
