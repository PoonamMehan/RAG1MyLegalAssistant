// CHATITERFACE
// <>
        // <div>
        //     {/* div to show the message history*/}
        //     <div>
        //         {messages.map((msg, idx)=>{
        //             console.log("Ran")
        //             if(msg.role==="assistant"){
        //                 return <div key={idx} className="mb-2 bg-red-300">{msg.message}</div>
        //             }else if(msg.role==="user"){
        //                 return <div key={idx} className="mb-2 bg-orange-400">{msg.message}</div>
        //             }
        //         })}
        //         {answerStream && <div className="mb-2 bg-red-300">{answerStream}</div>}
        //     </div>
        //     <div>
        //         <form onSubmit={handleSubmit(getAnswer)}>

        //         <input type="text" placeholder="Enter your query here!" {...register("userQuery", {
        //         required: true
        //         })}></input>
        //         <button type="submit">GetAnswer</button>
        //         </form>
                
        //     </div>
            
        // </div>
        // </>
    //         <div className="flex flex-col h-screen bg-gray-50"> {/* Full-screen container with a light background */}
    //             {/* Chat Message History */}
    //             <div className="flex-1 overflow-y-auto p-6 space-y-4">
    //                 {messages.map((msg, idx) => {
    //                     console.log("Ran");
    //                     if (msg.role === "assistant") {
    //                         return (
    //                             <div
    //                                 key={idx}
    //                                 className="max-w-[70%] ml-auto bg-blue-100 p-4 rounded-lg shadow-sm"
    //                             >
    //                                 {parse(msg.message)}
    //                             </div>
    //                         );
    //                     } else if (msg.role === "user") {
    //                         return (
    //                             <div
    //                                 key={idx}
    //                                 className="max-w-[70%] mr-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    //                             >
    //                                 {msg.message}
    //                             </div>
    //                         );
    //                     }
    //                 })}
    //                 {answerStream && (
    //                     <div className="max-w-[70%] ml-auto bg-blue-100 p-4 rounded-lg shadow-sm">
    //                         {parse(answerStream)}&#9822;
    //                     </div>
    //                 )}
                    
    //             </div>
        
    //             {/* Input Form (Sticks to the Bottom) */}
    //             <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
    //                 <form onSubmit={handleSubmit(getAnswer)} className="flex gap-2">
    //                     <input
    //                         type="text"
    //                         placeholder="Enter your query here!"
    //                         {...register("userQuery", { required: true })}
    //                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //                     />
    //                     <button
    //                         type="submit"
    //                         className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
    //                     >
    //                         Get Answer
    //                     </button>
    //                 </form>
    //             </div>
    //         </div>




    //LOGIN
    // <>

        // <span>Login using <button onClick={changeLoginWay}>{loginType==="email"?("Username"):("Email")}</button></span>

        // <form onSubmit={handleSubmit(login)}>
        //     {loginType==="email"? (<>

        // <label htmlFor="email">Email</label>
        // <input id="email" type="text" placeholder="Enter your email here: " {...register("email",{
        //         required: "Email is required",
        //         validate: {
        //             matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
        //         "Email address must be a valid address"
        //         }
        //     })}/>
        //     {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}
        // </>):(<>

        // <label htmlFor="username">Username</label>
        // <input id="username" type="text" placeholder="Enter your username here: " {...register("username",
        //     {
        //         required: "Username is required!"
        //     }
        // )}/>
        //     {formState.errors.username && <span className="text-red-600">{formState.errors.username.message}</span>}

        // </>)}
            
        //     <label htmlFor="password"></label>
        //     <input id="password" type="text" placeholder="Enter your password here: " {...register("password", {
        //         required:"Password is required",
        //         minLength: {
        //             value: 6,
        //             message: "Password must be longer than 6 characters"
        //         }
        //     })}/>
        //     {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}

        
        // <button type="submit">Submit</button>
        // </form>
        
        // </>




        //REGISTER
            // return(
    //     <form onSubmit={handleSubmit(signUp)}>
    //         <label htmlFor='username'>Username</label>
    //         <input id="username" type="text" placeholder="Enter your username here!" {...register("username",{
    //             required: "Username is required",
    //         })}/>
    //         {formState.errors.username && <span className="text-red-600">{formState.errors.username.message}</span>}


    //         <label htmlFor="email">Email</label>
    //         <input id="email" type="text" placeholder="Enter your email here!" {...register("email",{
    //             required: "Email is required",
    //             validate: {
    //                 matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
    //             "Email address must be a valid address"
    //             }
    //         })}/>
    //         {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}


    //         <label id="password">Password</label>
    //         <input id="password" type="text" placeholder="Enter your password here!" {...register("password",{
    //             required: "Password is required",
    //             minLength: {
    //                 value: 6,
    //                 message: "Password must be longer than 6 characters"
    //             },
    //         })}/>
    //         {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}


    //         <button>Submit</button>

    //     </form>
    // )