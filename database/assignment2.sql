INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

UPDATE public.account
SET account_type = 'Admin';


DELETE FROM public.account
WHERE account_id = 1;


UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior');


SELECT
	inv_id,
	inv_make,
	inv_model,
	inv_year,
	inv_description,
	inv_image,
	inv_thumbnail,
	inv_price,
	inv_miles,
	inv_color,
    inventory.classification_id
FROM
    public.inventory
INNER JOIN public.classification 
   ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;


UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');