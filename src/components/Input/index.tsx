import type React from "react";

type Input = {
    id: string;
    // type: "text" | "number" | "password"; //Aqui fazemos uma união type para que somente possa ser escolhido uma das categorias, ou um, ou outro (| = paipi)
} & React.ComponentProps<'input'>; //O & é chamado de interction, ele liga as propriedades que você criou junto com as que ja existe no elemento que vc quer, por exemplo input

export function Input({id, type}: Input){
    return (
        <>
            <label htmlFor={id}>task</label>
            <input id={id} type={type} />
        </>
    );
}