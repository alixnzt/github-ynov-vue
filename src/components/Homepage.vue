<template>
  <div>
    <nav class="navbar sticky-top navbar-light bg-light">
      <a class="navbar-brand">Github vue</a>
      <form style="display:inherit;">
        <datepicker placeholder="Date début" v-model="dateBegin" :format="formatDate"></datepicker>
        <datepicker placeholder="Date fin" v-model="dateEnd" :format="formatDate" ></datepicker>
        <multiselect v-model="selectedUsers" 
                      :options="repoItems" 
                      :multiple="true" 
                      :close-on-select="false"
                      :clear-on-select="false" 
                      :preserve-search="true"
                      placeholder="Selectionner repertoire" 
                      label="full_name" 
                      track-by="full_name" 
                      :preselect-first="true">   
        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
          v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
        </template>
        </multiselect>
        <button type="button" class="btn btn-primary" v-on:click="getCommitsForSelectedRepos()">Rechercher</button>
      </form>
    </nav>

    <div>
      <div class="container" style="padding-top: 10px;">
        <!-- <p v-for="repoIt in repoItems">{{repoIt}}</p> -->
        
        <h1 style="padding-top: 50px;">Liste des commits</h1>
          <div>
            <div v-for="repoTD in reposToDisplay" style="padding-top:10px">
              <div class="d-flex">
                <img :src=repoTD.avatar alt="" style="height:25px; weight:25px; padding-right: 20px;">
                <h3 class="text-secondary w-50">{{repoTD.author}} ({{repoTD.login}})</h3>
              </div>
              <h6 class="text-secondary">projet : {{repoTD.full_name}}</h6>
              <p>{{repoTD.readme}}</p>
              <table class="w-100">
                <thead>
                  <tr class="flex ">
                    <th scope="col">commit message</th>
                    <th scope="col">author</th>
                    <th scope="col">date</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="commit in repoTD.commits">
                      <td class="w-50">• {{commit.message}}</td>
                      <td>{{repoTD.author}}</td>
                      <td>{{formatDisplayDate(commit.date)}}</td>
                    </tr>
                </tbody>
              </table>
              <hr/>
            </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
//imports
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import Vue2Filters from 'vue2-filters';

export default {
  name: "Homepage",
  components: {
    Multiselect,
    Datepicker,
    Vue2Filters,
  },
  props: {
    token : `token d3db3b8367c18ddac1d3f72c31a80fc37d6c31de`,
  },
  data() {
    return {
      repoItems: [],
      selectedUsers: [],
      users: [],

      dateBegin:'',
      dateEnd:'',
      dateCommit:'',

      readme: '',

      reposToDisplay: [],

      commits: [],

      //localDatas
      localAccounts: [
        {
          id: 0,
          login: 'alixnzt',
        },
        {
          id: 1,
          login: 'mrolland'
        },
        {
          id: 2,
          login: 'xfidelo',
        },
        {
          id: 3,
          login: 'gegeblc',
        },
      ],
      localRepositories: [
        {
          id: 0,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 0,
            login:'alixnzt'
          }
        },
        {
          id: 1,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 1,
            login:'mael61'
          }
        },
        {
          id: 2,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 2,
            login:'mrolland'
          }
        },
      ],
      localCommits: [
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T08:08:20Z'
            },
            id:'0',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T09:00:00Z'
            },
            id:'1',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T09:15:00Z'
            },
            id:'2',
            message: 'Commit 2',
          }
        },
        {
          commit: {
            committer: {
              name: 'mael61',
              date: '2018-10-19T10:08:20Z'
            },
            id:'3',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'mael61',
              date: '2018-10-19T08:08:10Z'
            },
            id:'4',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T11:08:00Z'
            },
            id:'5',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T12:08:00Z'
            },
            id:'6',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T13:08:00Z'
            },
            id:'7',
            message: 'Commit 2',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T14:20:00Z'
            },
            id:'8',
            message: 'Commit 3',
          }
        },
      ],
    }
  },
  created(){
    this.getReposList();
  },
  methods: {
    getReposList(){
      var vm = this;
      axios({
        method:'get',
        url:'https://api.github.com/search/repositories?q=github-ynov-vue',
        responseType:'stream',
        headers: {'Authorization': vm.token }
      })
        .then(function(response) {
          response.data.items.map(function(value, key) {
            vm.repoItems.push(value);
            vm.users.push(value.owner.login)
          });
          console.log(vm.repoItems);
        })
    },
    formatDate(date) {
        return moment(date).format('DD-MM-YYYY');
    },
    formatDisplayDate(date) {
        return moment(date).format('DD-MM-YYYY à hh:mm:ss');
    },
    displayUsers() {

    },
    getCommitsForSelectedRepos(){
      var vm = this;
      vm.reposToDisplay = [];
      vm.selectedUsers.forEach((repo) => {
        var commits = []
        var repos = new Object();
        repos.login = repo.owner.login;
        repos.full_name = repo.full_name;
        repos.avatar = repo.owner.avatar_url;
        repos.readme = vm.getReadmes(repo);
        axios({
          method:'get',
          url: 'https://api.github.com/repos/'+repo.full_name+'/commits',
          responseType:'stream',
          headers: {'Authorization': vm.token}
        })
          .then(function(response) {
            response.data.forEach((commit) => {
              vm.dateCommit = new Date(commit.commit.author.date)
              if(vm.dateCommit >= vm.dateBegin && vm.dateCommit <= vm.dateEnd){
                repos.author = commit.commit.author.name;
                var repoCommit = new Object();
                repoCommit.message = commit.commit.message;
                repoCommit.date = commit.commit.author.date;
                commits.push(repoCommit);
              }
            })
          })
          repos.commits = commits
          vm.reposToDisplay.push(repos);
      })
      console.log(vm.reposToDisplay);
    },
    getReadmes(repo){
      axios
        .get(
          "https://api.github.com/repos/" +
            repo.owner.login +
            "/" +
            repo.name +
            "/readme"
        )
          .then(r => {
            this.readme = this.b64DecodeUnicode(r.data.content).replace(
              /(?:\r\n|\r|\n)/g,
              "</br>"
            );
          });
    },
    b64DecodeUnicode: str => {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    }
  },
};
</script>

<style scoped>

</style>
