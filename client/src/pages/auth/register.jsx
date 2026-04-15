import CommonForm from "@/components/common/form";
import {useToast} from "@/hooks/use-toast";
import {registerFormControls} from "@/config";
import {registerUser} from "@/store/auth-slice";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {Home} from "lucide-react";

const initialState = {
    userName: "",
    email: "",
    password: "",
};

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                });
                navigate("/auth/login");
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
                    Create new account
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Already have an account
                    <Link
                        className="font-medium ml-2 text-primary hover:text-primary/80 hover:underline transition-colors"
                        to="/auth/login"
                    >
                        Login
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={"Sign Up"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthRegister;
