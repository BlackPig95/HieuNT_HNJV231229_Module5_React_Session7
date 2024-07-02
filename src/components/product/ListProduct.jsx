import { useContext } from "react";
import ProductItem from "./ProductItem";
import { GlobalContext } from "../../context/Global";
function ListProduct()
{
    const { products } = useContext(GlobalContext);
    return (<>
        <main className="px-12">
            <h3 className="text-center uppercase font-semibold py-6">Danh sách sản phẩm</h3>
            <div className="grid grid-cols-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {/* { products.map((p) =>
                {
                    return (<ProductItem product={ p } key={ p.id } />);
                }) } */}
                { products.map((p) =>
                    <ProductItem product={ p } key={ p.id } />)
                }
            </div>
        </main>
    </>);
}

export default ListProduct;