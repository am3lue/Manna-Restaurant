(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using Manna
const UserApp = Manna
Manna.main()
