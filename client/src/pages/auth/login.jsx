import CommonForm from "@/components/common/form";
import {useToast} from "@/hooks/use-toast";
import {loginFormControls} from "@/config";
import {loginUser} from "@/store/auth-slice";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Home} from "lucide-react";

const initialState = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const {toast} = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/shop/home";

    function onSubmit(event) {
        event.preventDefault();

        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                });
                navigate(redirectPath, {replace: true});
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <Link to="/" className="absolute top-4 right-4 text-xl text-primary hover:text-primary/80 transition-colors">
                <Home />
            </Link>
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary">
                    Sign in to your account
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Don't have an account
                    <Link
                        className="font-medium ml-2 text-primary hover:text-primary/80 hover:underline transition-colors"
                        to="/auth/register"
                    >
                        Register
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={loginFormControls}
                buttonText={"Sign In"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthLogin;
