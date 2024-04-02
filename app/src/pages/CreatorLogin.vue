<template>
  <div>
    <h1>Creator Login</h1>
    <form action="">
      <div>
        <label for="name">Name:</label>
        <input type="text" placeholder="Name" id="name" name="name" />
      </div>
      <div>
        <label for="userName">Username:</label>
        <input
          type="text"
          placeholder="username"
          id="userName"
          name="userName"
        />
      </div>
      <div>
        <label for="description">Bio:</label>
        <textarea
          cols="30"
          rows="5"
          type="text"
          placeholder="Description"
          id="description"
          name="description"
        />
      </div>
    </form>
  </div>
</template>

<script setup></script>

<style scoped></style>
