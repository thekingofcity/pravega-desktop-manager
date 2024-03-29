import * as React from 'react';
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const ListItemLink = (props: ListItemLinkProps) => {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
                function Link(itemProps, ref) {
                    return (
                        <RouterLink
                            to={to}
                            ref={ref}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...itemProps}
                            role={undefined}
                        />
                    );
                }
            ),
        [to]
    );

    return (
        <li>
            <ListItem button component={renderLink} sx={{ paddingLeft: 2 }}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
};

// Fix ESLint error: propType "icon" is not required, but has no corresponding
// defaultProps declaration. (react/require-default-props)
ListItemLink.defaultProps = {
    icon: null,
};

export default ListItemLink;
