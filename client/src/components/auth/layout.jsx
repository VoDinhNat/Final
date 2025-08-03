

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-ful">
            <div className="hidden lg:flex items-center justify-center w-1/2 bg-black">
                <div className="max-w-md space-y-6 text-center text-primary-foreground">
                    <h1 className="text-4xl font-bold tracking-tight">Welcome to the Market</h1>
                </div>
            </div>
            <div className="flex flex-1 items-center bg-background px-4 py-12 sm:px-6 lg:px-8 justify-center w-1/2">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout;
