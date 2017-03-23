module.exports = {
  filter: function (users, searchText) {
    var filteredUsers = users;

    //Filter by searchText
    filteredUsers = filteredUsers.filter((user) => {
      var text = user.name.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredUsers;
  }
};
