<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users-cog"></i>
              Data Audience
            </h3>

            <div class="card-tools">
              <button class="btn btn-success" @click="newModal()">
                Add New
                <i class="fa fa-user-plus"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Register at</th>
                  <th>Modify</th>
                </tr>
                <tr v-for="user in users.data" :key="user.id">
                  <td>{{user.id}}</td>
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.type | Uptext}}</td>
                  <td>{{user.created_at | myDate}}</td>
                  <td>
                    <button type="button" class="btn btn-primary btn-sm" @click="editModal(user)">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="deleteUser(user.id)"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
            <pagination :data="users" @pagination-change-page="getResults"></pagination>
          </div>
        </div>
        <!-- /.card -->
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addNewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editmode" class="modal-title" id="addNewLabel">Add New User</h5>
            <h5 v-show="editmode" class="modal-title" id="addNewLabel">Edit User Profile Info</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editmode ? updateUser() :createUser()">
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                >
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                >
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <textarea
                  v-model="form.bio"
                  name="bio"
                  id="bio"
                  placeholder="bio of user(optional)"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="bio"></has-error>
              </div>
              <div class="form-group">
                <select
                  name="type"
                  v-model="form.type"
                  id="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                >
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
              <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //Object of data User
  data() {
    return {
      editmode: false,
      users: {},
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: "",
        points: ""
      })
    };
  },
  methods: {
    // Our method to GET results from a Laravel endpoint
    getResults(page = 1) {
      axios.get("api/user?page=" + page).then(response => {
        this.users = response.data;
      });
    },
    updateUser() {
      //console.log("Editing Data");
      this.$Progress.start();
      this.form
        .put("api/user/" + this.form.id)
        .then(() => {
          $("#addNew").modal("hide");
          swal("Updated!", "Your file has been Updated.", "success");
          Fire.$emit("AfterCreated");
          this.$Progress.finish();
        })
        .catch(() => {
          swal("Fail!", "Something Wrong", "warning");
          this.$Progress.fail();
        });
    },
    newModal() {
      this.editmode = false;
      this.form.reset();
      $("#addNew").modal("show");
    },
    editModal(user) {
      this.editmode = true;
      this.form.reset();
      $("#addNew").modal("show");
      this.form.fill(user);
    },
    deleteUser(id) {
      swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        //send request to the server
        if (result.value) {
          this.form
            .delete("api/user/" + id)
            .then(() => {
              swal("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("AfterCreated");
            })
            .catch(() => {
              swal("Fail!", "Something Wrong", "warning");
            });
        }
      });
    },
    loadUser() {
      axios.get("api/user").then(({ data }) => (this.users = data));
    },
    createUser() {
      this.$Progress.start();
      this.form
        .post("api/user")
        .then(() => {
          Fire.$emit("AfterCreated");
          $("#addNew").modal("hide");
          toast({
            type: "success",
            title: "User created successfully"
          });
          this.$Progress.finish();
        })
        .catch(() => {
          toast({
            type: "error",
            title: "Something wrong"
          });
        });
    }
  },
  created() {
    this.loadUser();
    Fire.$on("AfterCreated", () => {
      this.loadUser();
    });
    //setInterval(() =>  this.loadUser(), 3000);
    //console.log("Component mounted.");
  }
};
</script>