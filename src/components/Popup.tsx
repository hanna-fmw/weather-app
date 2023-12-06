type Props = {
	children: React.ReactNode
}

import React from 'react'

const Popup = ({ children }: Props) => {
	return (
		<div>
			<div>{children}</div>
		</div>
	)
}

export default Popup
