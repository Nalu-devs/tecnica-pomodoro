import type React from "react";

type Input = {
    id: string;
    labelText?: string; //Quando queremos que algo seja opcional colocamos o ? no fim do nome do elemento
    // type: "text" | "number" | "password"; //Aqui fazemos uma união type para que somente possa ser escolhido uma das categorias, ou um, ou outro (| = paipi)
} & React.ComponentProps<'input'>; //O & é chamado de interction, ele liga as propriedades que você criou junto com as que ja existe no elemento que vc quer, por exemplo input


// O ...rest serve para garantir que o restante das propriedades por exemplo do input apareça caso seja acionada no App.tsx

export function Input({id, labelText, type, ...rest}: Input){
    return (
        <>
        {/* Conseguimos tbm aplicar js no tsx, para isso usamos {} */}
        {/* Condicional simples de uma linha = condição ? 'verdadeiro' : 'falso' */}
        {/* Tambem podemos remover o termo falso, caso seja vazio '', usando = condição && 'exibe isso se for verdadeiro' */}
        {labelText && <label htmlFor={id}>{labelText}</label>} {/*Nessa linha falamos que se o labelText existir o texto dele é exibido na tela, se não retorna vazio */}
            <input id={id} type={type} {...rest}/>
        </>
    );
}