window.onload = async () => {
  if (location.href.indexOf("code") === -1) return

  const code = location.href.substring(location.href.indexOf("code") + 5, location.href.length);

  localStorage.setItem("code", code)

  let {data} = await axios.post(`${location.origin}/user`, code).catch(e => {
    document.getElementById('info').innerText = `There was an error with that. Please try logging in again. Error Code: ${e.response.status}`;
    return {data: null};
  });

  if (data) document.getElementById("info").innerText = `Welcome, ${data.tag === "#0" ? data.username : data.username + data.tag}!`
}