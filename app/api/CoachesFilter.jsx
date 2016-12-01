module.exports = {
  filter: function (coaches, searchText) {
    var filteredCoaches = coaches;

    //Filter by searchText
    filteredCoaches = filteredCoaches.filter((coach) => {
      var text = coach.name.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });
    
    return filteredCoaches;
  }
};
