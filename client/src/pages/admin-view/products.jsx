import { Button } from "@/components/ui/button";
import {Fragment} from "react";





function AdminProducts() {
    return (
        <Fragment>
            <div className="mb-5 w-full flex">
                <Button onClick={() => setOpenCreateProductsDialog(true)}
                        style={{backgroundColor: '#1E90FF', color: '#ffffff'}}>
                    <FaPlus className="mr-2"/>
                    Add New Product
                </Button>
            </div>
        </Fragment>
    )
}

export default AdminProducts;