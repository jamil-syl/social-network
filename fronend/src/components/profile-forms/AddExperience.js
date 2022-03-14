import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience }) => {
	const [formData, setFormData] = useState({
		title: "",
		company: "",
		location: "",
		from: "",
		to: "",
		current: false,
		description: "",
	});

	const { title, company, location, from, to, current, description } = formData;

	const [toDateDisabled, toggleDisabled] = useState(false);

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<section className='container'>
			<h1 className='large text-primary'>Add An Experience</h1>
			<p className='lead'>
				<i className='fas fa-code-branch'></i> Add any developer/programming
				positions that you have had in the past
			</p>
			<small>* = required field</small>
			<form
				className='form'
				onSubmit={(e) => {
					e.preventDefault();
					addExperience(formData);
				}}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Job Title'
						name='title'
						value={title}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Company'
						name='company'
						value={company}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Location'
						name='location'
						value={location}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<h4>From Date</h4>
					<input
						type='date'
						name='from'
						value={from}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<p>
						<input
							type='checkbox'
							name='current'
							value={current}
							onChange={(e) => {
								setFormData({
									...formData,
									current: !current,
									to: "",
								});
								toggleDisabled(!toDateDisabled);
							}}
							checked={current}
						/>{" "}
						Current Job
					</p>
				</div>
				<div className='form-group'>
					<h4>To Date</h4>
					<input
						type='date'
						name='to'
						value={to}
						onChange={(e) => onChange(e)}
						disabled={toDateDisabled ? "disabled" : ""}
					/>
				</div>
				<div className='form-group'>
					<textarea
						name='description'
						cols='30'
						rows='5'
						placeholder='Job Description'
						value={description}
						onChange={(e) => onChange(e)}></textarea>
				</div>
				<input
					type='submit'
					value='Add Experience'
					className='btn btn-primary my-1'
				/>
				<Link className='btn btn-light my-1' to='/dashboard'>
					Go Back
				</Link>
			</form>
		</section>
	);
};

export default connect(null, { addExperience })(AddExperience);
