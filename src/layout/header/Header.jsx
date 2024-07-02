import { ShoppingCartOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Global";
import ModalCart from "../../components/modal/ModalCart";

function Header()
{
    const { cartLength } = useContext(GlobalContext);
    const [ open, setOpen ] = useState(false);
    const showDrawer = () =>
    {
        setOpen(true);
    };
    const onClose = () =>
    {
        setOpen(false);
    };
    return (
        <>
            <header className="h-14 w-full bg-orange-500 flex items-center justify-between px-12 text-white">
                <ul className="flex gap-3">
                    <li>Trang chủ</li>
                    <li>Danh sách sản phẩm</li>
                </ul>
                <div onClick={ showDrawer } className="relative hover:cursor-pointer">
                    <ShoppingCartOutlined className="text-3xl" />
                    <p className="bg-red-500 px-2 text-sm absolute top-[-10px] right-[-20px] rounded-lg hover:text-2xl transition-all duration-150 ease-linear">{ cartLength }</p>
                </div>
                <ModalCart onClose={ onClose } openModal={ open } />
            </header>
        </>);
}

export default Header;