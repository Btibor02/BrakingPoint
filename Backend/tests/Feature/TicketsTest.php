<?php

namespace Tests\Feature;

use App\Models\Ticket;
use Tests\TestCase;
class TicketsTest extends TestCase
{

    public function testGetAllBets()
    {
        $response = $this->get('/api/tickets');
    
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['ticketID', 'status', 'debt', 'odds', 'races', 'userID', 'betID',],
        ]);

    }
    public function testCreateOneBet()
    {

        $data = [
            'status' => 'ongoing',
            'debt' => 100,
            'odds' => 1,
            'races' => 'versus',
            'userID' => '1',
            'betID' => '1'
        ];
        $response = $this->post('/api/tickets', $data);
        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', $data);


    }
    public function testGetOneBet()
    {

        $ticket = new Ticket([
            'status' => 'ongoing',
            'debt' => 100,
            'odds' => 2,
            'races' => 'versus',
            'userID' => '1',
            'betID' => '3'
        ]);
        $ticket->save();
        $response = $this->get('/api/tickets/' . $ticket->ticketID);
        $response->assertStatus(200);
        $response->assertJson([
            'ticketID' => $ticket->ticketID,
            'status' => $ticket->status,
            'debt' => $ticket->debt,
            'odds' => $ticket->odds,
            'races' => $ticket->races,
            'userID' => $ticket->userID,
            'betID' => $ticket->betID
        ]);
        $response = $this->delete('/api/tickets/' . $ticket->ticketID);

    }
    public function testPatchBet()
    {

        $ticket = new Ticket([
            'status' => 'ongoing',
            'debt' => 100,
            'odds' => 3,
            'races' => 'versus',
            'userID' => '1',
            'betID' => '1'
        ]);
        $data= [
            'odds' => 1.3,
            'debt' => 50,
        ];
        $ticket->save();
        $response = $this->patch('/api/tickets/' . $ticket->ticketID, $data);


        $response->assertStatus(200);
        $this->assertDatabaseHas('tickets', array_merge(['ticketID' => $ticket->ticketID], $data));
        $response = $this->delete('/api/tickets/' . $ticket->ticketID);
    }
    public function testDeleteBet()
    {

        $ticket = new Ticket([
            'status' => 'ongoing',
            'debt' => 100,
            'odds' => 3,
            'races' => 'versus',
            'userID' => '1',
            'betID' => '1'
        ]);
        $ticket->save();
        $response = $this->delete('/api/tickets/' . $ticket->ticketID);


        $response->assertStatus(204);
        $this->assertDatabaseMissing('tickets', ['ticketID' => $ticket->id]);

    }
}
