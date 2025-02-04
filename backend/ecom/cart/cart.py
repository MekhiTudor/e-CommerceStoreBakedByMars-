class Cart():
    def __init__(self, request):
        self.session = request.session

        #get the current session
        cart = self.session.get('session_key')

        #if the user is new create one
        if 'session_key' not in request.session:
            cart = self.session['session_key'] = {}


        self.cart = cart