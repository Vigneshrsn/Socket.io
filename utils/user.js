const users = [];

function userjoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
};

function getcurrentuser(id) {
    return users.find(user => user.id === id);
};

function userleave(id) {
    const index = users.findIndex(user => user.id === id);
    userleave= users.find(user => user.id === id);
    users.splice(index, 1);
    return userleave;
    // if (index != -1) {
    //     return 
    // }
};

function roomuser(room) {
    return users.filter(user => user.room === room);
}
module.exports = { userjoin, getcurrentuser, userleave, roomuser }