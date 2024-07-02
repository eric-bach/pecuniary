import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type LocationsType = {
Home: string;
"Tom's": string;
Field: string;
};

const locations: LocationsType = {
Field: "field",
Home: "home",
"Tom's": "toms",
};

const formSchema = z.object({
    variety: z.string().min(1).max(50),
    quantity: z.preprocess((a) => parseInt(z.string().parse(a)), z.number()),
    location_from: z.string().min(1).max(50),
    location_to: z.string().min(1).max(50),
});

type FormSchemaType = z.infer<typeof formSchema>;

const InventoryForm = () => {
const [selectOptions, setSelectOptions] = useState(["Home", "Tom's"]);
const {
register,
handleSubmit,
watch,
setValue, // Destructure setValue here
formState: { errors },
} = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });

function onSubmit(values: z.infer<typeof formSchema>) {
console.log(values);
const form = new FormData();

for (let entry of Object.entries(values)) {
let key = String(entry[0]);
let value = String(entry[1]);
form.append(key, value);
}

fetch(`https://test.com/api/add_inventory`, {
method: "POST",
body: form,
})
.then((res) => console.log(res))
.then((data) => console.log(data));
}

const test = watch("location_from");

useEffect(() => {
if (test === "toms") {
setSelectOptions(["Home"]);
setValue("location_to", "home");
} else if (test === "home") {
setSelectOptions(["Tom's"]);
setValue("location_to", "toms");
} else {
setSelectOptions(["Home", "Tom's"]);
}

console.log("Test", test);
}, [test]);

return (
<>
<form
className="new-inventory-form"
onSubmit={handleSubmit(onSubmit)}
{...register}
>
<label className="form-label" htmlFor="variety">
Variety
</label>

<select id="variety" {...register("variety")}>
<option defaultValue="" disabled>
Select Variety
</option>

{varieties.map((e) => (
<option value={e.toLowerCase().replace(" ", "-")}>{e}</option>
))}
</select>

<label className="form-label" htmlFor="quantity">
Quantity
</label>

<input type="number" defaultValue={0} {...register("quantity")} />

<span className="error">
{errors.quantity && errors.quantity?.message}
</span>

<label className="form-label" htmlFor="location\\\\\\\_from">
From
</label>

<select {...register("location_from")}>
{Object.entries(locations).map((location) => (
<option value={location\\\\\\\[1\\\\\\\]}>{location\\\\\\\[0\\\\\\\]}</option>
))}

</select>

<label className="form-label" htmlFor="location\\\\\\\_to">

To

</label>

<select defaultValue={selectOptions[0]} {...register("location_to")}>

{selectOptions.map((e) => {
if (e != test) {
return (
<option value={e.toLowerCase().replace("'", "")}>{e}</option>
);
}
})}
</select>

<input className="form-submit-button" type="submit" />
</form>
</>
);
};