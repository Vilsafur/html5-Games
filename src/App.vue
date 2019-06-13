<template>
  <div id="app">
    <div id="nav">
      <b-nav>
        <b-nav-item active><router-link to="/">Home</router-link></b-nav-item>
        <b-nav-item-dropdown
          id="my-nav-dropdown"
          text="Games"
          toggle-class="nav-link-custom"
          right
        >
          <b-dropdown-item><router-link to="/games/bricks">Bricks</router-link></b-dropdown-item>
          <b-dropdown-item><router-link to="/games/labyrinth">Labyrinth</router-link></b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item><router-link to="/about">About</router-link></b-nav-item>
      </b-nav>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
