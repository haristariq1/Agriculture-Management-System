export const TOGGLETHEME=()=>({type:'ui/toggle_theme'});
export const SHOWTOAST=(message,variant='success')=>({type:'ui/show_toast',payload:{message,variant}});
export const HIDETOAST=()=>({type:'ui/hide_toast'});
export const TOGGLESIDEBAR=()=>({type:'ui/toggle_sidebar'});
