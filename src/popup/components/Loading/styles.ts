import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999999,
    background: 'white',
    transition: 'opacity 1s',
    '&.loading': {
      opacity: 1,
      display: 'block',
    },
    '&.notLoading': {
      opacity: 0,
      display: 'none',
    },
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex !important',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.typography.fontSize,
    marginBottom: theme.spacing(1),
  },
  anim9: {
    width: '160px',
    height: '6px',
    background: 'linear-gradient(to right, #5539DF, #5539DF 30%, #999 10%)',
    animation: '$anim9 1s linear infinite',
  },
  '@keyframes anim9': {
    to: { backgroundPosition: '160px' },
  },
}));

export default useStyles;
