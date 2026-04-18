'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { bdDistricts, bdThanas } from '../data/bd-locations';
import { useCart } from '../contexts/CartContext';
import { initiatePayment } from '../services/handlePayment';

const phoneRegex = new RegExp(/^01[3-9]\d{8}$/);

const billingSchema = z.object({
	customer_name: z.string().min(2, { message: 'Full name is required' }),
	mobile: z.string().regex(phoneRegex, { message: 'Must be a valid 11-digit BD number' }),
	district: z.string().min(1, { message: 'District is required' }),
	thana: z.string().min(1, { message: 'Thana is required' }),
	address: z.string().min(5, { message: 'Full address is required' }),
});

type BillingFormInputs = z.infer<typeof billingSchema>;

const CheckoutPage = () => {
	const navigate = useNavigate();
	const { cartItems, cartTotal } = useCart();
	const [selectedDistrict, setSelectedDistrict] = useState('');
	const [thanas, setThanas] = useState<{ id: string; name: string }[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
		watch,
		resetField,
		formState: { errors },
	} = useForm<BillingFormInputs>({
		resolver: zodResolver(billingSchema),
		defaultValues: {
			customer_name: '',
			mobile: '',
			district: '',
			thana: '',
			address: '',
		},
	});

	const districtValue = watch('district');

	useEffect(() => {
		if (districtValue) {
			setSelectedDistrict(districtValue);
			setThanas(bdThanas[districtValue] || []);
			resetField('thana');
		} else {
			setSelectedDistrict('');
			setThanas([]);
		}
	}, [districtValue, resetField]);

	const onSubmit = async (data: BillingFormInputs) => {
		setIsSubmitting(true);
		setError(null);

		if (!cartItems || cartItems.length === 0) {
			setError('Your cart is empty. Please add items before proceeding to payment.');
			setIsSubmitting(false);
			return;
		}

		try {
			const normalizedCart = cartItems.map((item) => ({
				id: item.id,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
			}));

			await initiatePayment({
				name: data.customer_name,
				phone: data.mobile,
				address: data.address,
				thana: data.thana,
				district: data.district,
				total: cartTotal,
				items: normalizedCart,
			});
		} catch (caughtError) {
			setIsSubmitting(false);
			let errorMessage = caughtError instanceof Error ? caughtError.message : 'Payment initialization failed';

			if (errorMessage.includes('Unexpected token')) {
				errorMessage = 'Payment server returned invalid response. The payment gateway may be temporarily unavailable. Please try again in a few moments.';
			} else if (errorMessage.includes('temporarily unavailable') || errorMessage.includes('paused')) {
				errorMessage = 'The payment service is temporarily unavailable. Please contact support or try again later.';
			} else if (errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
				errorMessage = 'Connection error. Please check your internet connection and try again.';
			} else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
				errorMessage = 'Authentication error. Please refresh the page and try again.';
			} else if (errorMessage.includes('400') || errorMessage.includes('Missing required fields')) {
				errorMessage = 'Please fill in all required fields correctly.';
			}

			setError(errorMessage);
		}
	};

	return (
		<div className="min-h-screen bg-[#030b1e] flex items-start justify-center px-4 py-12 text-slate-100 sm:px-6">
			<div className="w-full max-w-[550px] rounded-2xl border border-slate-700/50 bg-[#07132b] shadow-2xl">
				<div className="border-b border-slate-700/50 px-6 py-4">
					<h2 className="text-lg font-bold text-white">Checkout</h2>
					<p className="text-xs text-slate-400">Shipping & Billing Information</p>
				</div>

				{error && (
					<div className="mx-6 mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="p-6">
					<div className="space-y-5">
						<div className="space-y-1.5">
							<label htmlFor="customer_name" className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
								Full Name
							</label>
							<input
								id="customer_name"
								{...register('customer_name')}
								placeholder="e.g. Farhan Kabir"
								className={`w-full rounded-lg border bg-slate-900/50 px-4 py-2.5 text-sm transition-all outline-none ${
									errors.customer_name ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-slate-700 focus:border-indigo-500'
								}`}
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label htmlFor="mobile" className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
									Mobile
								</label>
								<input
									id="mobile"
									type="tel"
									{...register('mobile')}
									placeholder="017XXXXXXXX"
									className={`w-full rounded-lg border bg-slate-900/50 px-4 py-2.5 text-sm transition-all outline-none ${
										errors.mobile ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-slate-700 focus:border-indigo-500'
									}`}
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="district" className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
									District
								</label>
								<Controller
									name="district"
									control={control}
									render={({ field }) => (
										<select
											id="district"
											{...field}
											className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
										>
											<option value="">Select District</option>
											{bdDistricts.map((d) => (
												<option key={d.id} value={d.id}>
													{d.name}
												</option>
											))}
										</select>
									)}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="thana" className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
								Thana / Area
							</label>
							<Controller
								name="thana"
								control={control}
								render={({ field }) => (
									<select
										id="thana"
										{...field}
										disabled={!selectedDistrict}
										className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm outline-none disabled:opacity-50 focus:border-indigo-500"
									>
										<option value="">Select Thana</option>
										{thanas.map((t) => (
											<option key={t.id} value={t.name}>
												{t.name}
											</option>
										))}
									</select>
								)}
							/>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="address" className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
								Street Address
							</label>
							<textarea
								id="address"
								rows={2}
								{...register('address')}
								placeholder="House number, street name, etc."
								className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
							/>
						</div>
					</div>

					<div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-700/50 pt-6 sm:flex-row">
						<div className="text-center sm:text-left">
							<p className="text-[10px] uppercase tracking-widest text-slate-500">Total Payable</p>
							<p className="text-lg font-black text-indigo-400">{cartTotal.toLocaleString()} BDT</p>
						</div>

						<div className="flex w-full gap-3 sm:w-auto">
							<button
								type="button"
								onClick={() => navigate('/cart')}
								disabled={isSubmitting}
								className="flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting || cartItems.length === 0}
								className="flex-1 rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:opacity-50 sm:flex-none"
							>
								{isSubmitting ? 'Processing...' : 'Confirm Order'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CheckoutPage;
