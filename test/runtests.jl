# This file is autogenerated to run all tests in the context of your Genie app.
# It is not necessary to edit this file.
# To create tests, simply add `.jl` test files in the `test/` folder.
# All `.jl` files in the `test/` folder will be automatically executed by running `$ julia --project runtests.jl`
# If you want to selectively run tests, use `$ julia --project runtests.jl test_file_1 test_file_2`

ENV["GENIE_ENV"] = "test"
push!(LOAD_PATH, abspath(normpath(joinpath("..", "src"))))

cd("..")
using Pkg
Pkg.activate(".")

using Genie
Genie.loadapp()

cd(@__DIR__)
Pkg.activate(".")

# !!! Main.UserApp is configured as an alias for Main.Manna and you might encounter it in some tests
using Main.Manna, Test, TestSetExtensions, Logging

Logging.global_logger(NullLogger())

@testset ExtendedTestSet "Manna tests" begin
  @includetests ARGS
end
