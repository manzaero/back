
module.exports = function (user){
    if (!user) return null
    return {
        name: user.name || '',
        id: user._id.toString(),
        email: user.email,
        roleId: user.role
    }
}