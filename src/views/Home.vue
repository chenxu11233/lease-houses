<template>
  <div class="home">
    <Header></Header>
    <VSideBar></VSideBar>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import VSideBar from "@/components/VSideBar.vue";
import bus from "../assets/js/bus";

export default {
  name: "Home",
  data() {
    return {
      collapse: false,
    };
  },
  components: {
    Header,
    VSideBar,
  },
  created() {
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>
