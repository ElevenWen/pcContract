<template></template>

<script>
export default {
  layout: "ec",
  name: "mana-create",
  fetch({ route, redirect }) {
    if (route.name==='mana-create') {
       return redirect("/mana/list");
    }
  }
};
</script>
