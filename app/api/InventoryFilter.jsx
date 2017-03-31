module.exports = {
  filter: function (inventory, searchText) {
    var filteredInventory= inventory;

    //Filter by searchText
    filteredInventory = filteredInventory.filter((item) => {
      var text = item.name.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredInventory;
  }
};
