type Props = {
	children: React.ReactNode
}

import React from 'react'

const Popup = ({ children }: Props) => {
	return (
		<div>
			<p>{children}</p>
		</div>
	)
}

export default Popup
